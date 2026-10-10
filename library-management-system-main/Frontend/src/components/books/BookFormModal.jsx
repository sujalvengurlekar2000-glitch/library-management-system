import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  LoaderCircle,
  Plus,
  Save,
  X,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1000;
const MAX_YEAR = CURRENT_YEAR + 1;

const initialValues = {
  title: "",
  author: "",
  publishedYear: "",
  price: "",
};

const validateForm = (values) => {
  const errors = {};
  const title = values.title.trim();
  const author = values.author.trim();
  const publishedYear = Number(values.publishedYear);
  const price = Number(values.price);

  if (!title) {
    errors.title = "Title is required";
  }

  if (!author) {
    errors.author = "Author is required";
  }

  if (!values.publishedYear.toString().trim()) {
    errors.publishedYear = "Published year is required";
  } else if (
    !Number.isInteger(publishedYear) ||
    publishedYear < MIN_YEAR ||
    publishedYear > MAX_YEAR
  ) {
    errors.publishedYear = `Published year must be between ${MIN_YEAR} and ${MAX_YEAR}`;
  }

  if (!values.price.toString().trim()) {
    errors.price = "Price is required";
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price must be zero or greater";
  }

  return errors;
};

function BookFormModal({
  isOpen,
  mode,
  book,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && book) {
      setFormValues({
        title: book.title ?? "",
        author: book.author ?? "",
        publishedYear: book.publishedYear?.toString() ?? "",
        price: book.price?.toString() ?? "",
      });
    } else {
      setFormValues(initialValues);
    }

    setErrors({});
  }, [isOpen, mode, book]);

  const isEditMode = mode === "edit";

  const titleText = useMemo(
    () => (isEditMode ? "Edit Book" : "Add a New Book"),
    [isEditMode]
  );

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));

    setErrors((previousErrors) => {
      if (!previousErrors[name]) {
        return previousErrors;
      }

      const nextErrors = { ...previousErrors };
      delete nextErrors[name];

      return nextErrors;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      title: formValues.title.trim(),
      author: formValues.author.trim(),
      publishedYear: Number(formValues.publishedYear),
      price: Number(formValues.price),
    });
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClasses =
      "w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";

    if (errors[fieldName]) {
      return `${baseClasses} border-red-400 focus:border-red-500 focus:ring-red-100`;
    }

    return `${baseClasses} border-slate-200 focus:border-indigo-500 focus:ring-indigo-100`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-form-title"
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-slate-950/30"
      >
        {/* Modal Header */}
        <header className="relative overflow-hidden bg-linear-to-br from-slate-950 via-indigo-950 to-violet-900 px-6 py-7 text-white sm:px-8">
          <div className="pointer-events-none absolute -right-10 -top-14 text-white opacity-[0.08]">
            <BookOpen size={170} strokeWidth={1.2} />
          </div>

          <div className="pointer-events-none absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-indigo-200 shadow-lg backdrop-blur">
                {isEditMode ? <Save size={22} /> : <Plus size={22} />}
              </div>

              <div>
                <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-indigo-200">
                  {isEditMode ? "UPDATE RECORD" : "NEW LIBRARY RECORD"}
                </span>

                <h2
                  id="book-form-title"
                  className="mt-3 text-2xl font-bold tracking-tight"
                >
                  {titleText}
                </h2>

                <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-300">
                  {isEditMode
                    ? "Update the information for this book in your collection."
                    : "Enter the details below to add a new book to your library."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              aria-label="Close modal"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 px-6 py-7 sm:px-8">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Book Title
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formValues.title}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getInputClassName("title")}
                placeholder="Enter the book title"
              />

              {errors.title ? (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.title}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-400">
                  Enter the complete title of the book.
                </p>
              )}
            </div>

            {/* Author */}
            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Author Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="author"
                name="author"
                type="text"
                value={formValues.author}
                onChange={handleChange}
                disabled={isSubmitting}
                className={getInputClassName("author")}
                placeholder="Enter the author name"
              />

              {errors.author ? (
                <p className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.author}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-slate-400">
                  Enter the primary author of this book.
                </p>
              )}
            </div>

            {/* Year and Price */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="publishedYear"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Published Year
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="publishedYear"
                  name="publishedYear"
                  type="number"
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  value={formValues.publishedYear}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={getInputClassName("publishedYear")}
                  placeholder="e.g. 2024"
                />

                {errors.publishedYear ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {errors.publishedYear}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Between {MIN_YEAR} and {MAX_YEAR}.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Price
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                    ₹
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formValues.price}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${getInputClassName("price")} pl-9`}
                    placeholder="0.00"
                  />
                </div>

                {errors.price ? (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">
                    {errors.price}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Enter zero or a positive value.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : isEditMode ? (
                <>
                  <Save size={17} />
                  Update Book
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add Book
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default BookFormModal;