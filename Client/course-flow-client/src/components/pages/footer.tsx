function FooterPage() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <div className="font-bold text-lg">CourseFlow</div>
          <p className="mt-3 text-sm text-slate-400">
            Learn online — Elevate your skills.
          </p>
        </div>
        <div className="text-sm text-slate-400">
          <div className="font-medium text-slate-200">Contact</div>
          <div className="mt-2">sonltute@gmail.com</div>
          <div className="mt-1">+84 123 456 789</div>
        </div>

        <div className="text-sm text-slate-400">
          <div className="font-medium text-slate-200">Follow Us</div>
          <div className="mt-2 flex gap-3">
            <a
              href="https://www.facebook.com/ninh.cam.144?locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800/40 text-center py-4 text-xs text-slate-500">
        © {new Date().getFullYear()} CourseFlow. All rights reserved.
      </div>
    </footer>
  );
}

export default FooterPage;
