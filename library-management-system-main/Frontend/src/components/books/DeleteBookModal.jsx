import {
  AlertTriangle,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";

function DeleteBookModal({
  isOpen,
  book,
  isSubmitting,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !book) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-book-title"
        aria-describedby="delete-book-description"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-slate-950/30"
      >
        <div className="relative px-6 pb-7 pt-8 text-center sm:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close delete confirmation"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>

          <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-red-100" />
            <div className="absolute inset-2 rounded-2xl bg-red-200/60" />

            <AlertTriangle
              size={32}
              className="relative text-red-600"
              strokeWidth={2}
            />
          </div>

          <span className="mt-5 inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-red-600">
            DESTRUCTIVE ACTION
          </span>

          <h2
            id="delete-book-title"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-950"
          >
            Delete this book?
          </h2>

          <p
            id="delete-book-description"
            className="mt-2 text-sm leading-6 text-slate-500"
          >
            You are about to permanently remove this book from your library
            collection.
          </p>

          <div className="mt-5 rounded-2xl border border-red-100 bg-linear-to-br from-red-50 to-orange-50/50 px-5 py-4 text-left">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                <Trash2 size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                  Book to be deleted
                </p>

                <p className="mt-1 wrap-break-word text-base font-bold text-red-950">
                  {book.title}
                </p>

                {book.author ? (
                  <p className="mt-0.5 wrap-break-word text-sm text-red-700">
                    by {book.author}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-left">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              This action cannot be undone. The book record will be permanently
              removed from the database.
            </p>
          </div>
        </div>

        <footer className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={17} />
                Delete Book
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default DeleteBookModal;