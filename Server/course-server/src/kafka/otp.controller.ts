import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Inject } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  KafkaContext,
  ClientKafka,
  MessagePattern,
} from '@nestjs/microservices';

@Controller()
export class OtpConsumerController {
  constructor(
    private readonly mailerService: MailerService,
    @Inject('OTP_KAFKA') private readonly kafka: ClientKafka,
  ) {}

  @MessagePattern('course.send')
  async handleSendCourseEmail(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const { email, orderId, courseName, ts } = message;

    let attempts = 0;
    const maxAttempts = 3;

    console.log(`Sending course confirmation to ${email} at ${ts}`);

    while (attempts < maxAttempts) {
      try {
        attempts++;

        await this.mailerService.sendMail({
          to: email,
          subject: 'Xác nhận đăng ký khóa học thành công',
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #2c3e50;">🎉 Chúc mừng bạn đã đăng ký thành công!</h2>

            <p>Xin chào,</p>

            <p>Bạn đã đăng ký thành công khóa học:</p>
            <h3 style="color: #2980b9; margin-bottom: 12px;">${courseName}</h3>

            <p>Mã đơn hàng của bạn:</p>
            <p style="font-size: 18px; font-weight: bold; color: #27ae60;">
         
            </p>

            <p>Thời gian xác nhận: ${ts}</p>

            <hr style="margin: 20px 0;" />

            <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.</p>
            <p>Chúc bạn học tập hiệu quả!</p>

            <p style="margin-top: 24px; font-size: 14px; color: #7f8c8d;">
            </p>
          </div>
        `,
        });

        console.log(`Course email sent successfully to ${email}`);
        return { success: true, email };
      } catch (error) {
        console.error(`Attempt ${attempts} failed for ${email}`, error);

        if (attempts >= maxAttempts) {
          console.error(
            `Failed to send course email to ${email} after ${maxAttempts} attempts`,
          );

          this.kafka.emit('course.send.error', {
            email,
            orderId,
            ts,
          });
        }

        return null;
      }
    }
  }

  @MessagePattern('forget.send')
  async handleSendPassword(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const { email, generatePassword, ts } = message;

    let attempts = 0;
    const maxAttempts = 3;

    console.log(`Sending course confirmation to ${email} at ${ts}`);

    while (attempts < maxAttempts) {
      try {
        attempts++;

        await this.mailerService.sendMail({
          to: email,
          subject: 'New password',
          html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f9fc; border-radius: 8px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.07);">

          <h2 style="color: #2c3e50; margin-top: 0;">
            🎉 Reset password success!
          </h2>

          <p style="font-size: 15px; color: #333;">
            Hello guy,
            <br/>
            Thank for using our service! You have successfully reset your password 
          </p>

          <div style="margin: 20px 0; padding: 16px; background: #f0f7ff; border-left: 4px solid #3498db; border-radius: 4px;">
            <p style="margin: 0; font-size: 15px;">
              <strong>📘 New password:</strong> ${generatePassword}
            </p>
    
            <p style="margin: 8px 0 0; font-size: 14px; color: #666;">
              <strong>⏰ You need login and change it</strong> ${ts}
            </p>
          </div>

     

        
          <hr style="margin: 28px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 14px; color: #555; margin-bottom: 0;">
            Nếu bạn có bất kỳ thắc mắc nào, hãy phản hồi lại email này hoặc liên hệ đội ngũ hỗ trợ.
            <br/>
            Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!
          </p>

          <p style="margin-top: 16px; font-size: 13px; color: #999; text-align: center;">
            © 2025 CourseFlow – Nền tảng học trực tuyến.
          </p>

        </div>
      </div>
        `,
        });

        console.log(`Course email sent successfully to ${email}`);
        return { success: true, email };
      } catch (error) {
        console.error(`Attempt ${attempts} failed for ${email}`, error);

        if (attempts >= maxAttempts) {
          console.error(
            `Failed to send course email to ${email} after ${maxAttempts} attempts`,
          );

          this.kafka.emit('course.send.error', {
            email,
            generatePassword,
            ts,
          });
        }

        return null;
      }
    }
  }

  @MessagePattern('otp.send')
  async handleSendOtp(@Payload() message: any, @Ctx() context: KafkaContext) {
    const { email, otp, ts } = message;
    let attempts = 0;
    console.log(`Sending OTP to ${email}: ${otp} at ${ts}`);
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        attempts++;
        await this.mailerService.sendMail({
          to: email,
          subject: 'Mã OTP đăng ký của bạn',
          text: `Mã OTP của bạn là: ${otp} (tạo lúc ${ts})`,
          html: `<p>Mã OTP của bạn là: <b>${otp}</b></p><p>Thời gian: ${ts}</p>`,
        });
        console.log(`OTP sent successfully to ${email}`);
        return { success: true, email };
      } catch (error) {
        if (attempts >= maxAttempts) {
          console.error(
            `Failed to send OTP to ${email} after ${maxAttempts} attempts`,
            error,
          );
          this.kafka.emit('otp.send.error', {
            email,
          });
        }
        return null;
      }
    }
  }

  @EventPattern('otp.send.error')
  async handleSendOtpError(
    @Payload() message: any,
    @Ctx() context: KafkaContext,
  ) {
    const { email } = message;
    console.error(
      `Error sending OTP to ${email}. Please check the logs for details.`,
    );
  }
}
