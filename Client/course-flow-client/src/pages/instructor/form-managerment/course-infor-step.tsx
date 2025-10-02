import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

function CourseInforStep({
  formCourse,
  categories,
}: {
  formCourse: any;
  categories: { id: number; name: string }[];
}) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="grid grid-cols-2 gap-8"
    >
      <FormField
        control={formCourse.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                className="rounded-2xl p-4"
                placeholder="Course Title"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formCourse.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                type="number"
                className="rounded-2xl p-4"
                placeholder="Price"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formCourse.control}
        name="description"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormControl>
              <Textarea
                className="rounded-2xl p-4"
                placeholder="Description"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formCourse.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value ? String(field.value) : ""}
              >
                <SelectTrigger className="rounded-2xl p-4">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overscroll-y-auto">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}

export default CourseInforStep;
