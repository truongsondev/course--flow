function CategoryPage() {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-6 py-8">
      <h3 className="text-lg font-semibold">Danh mục</h3>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {[
          "Development",
          "Design",
          "Data Science",
          "DevOps",
          "Marketing",
          "Business",
        ].map((c) => (
          <div
            key={c}
            className="bg-white p-4 rounded-2xl shadow text-center text-sm"
          >
            <div className="h-12 flex items-center justify-center text-2xl">
              🎓
            </div>
            <div className="mt-2 font-medium">{c}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryPage;
