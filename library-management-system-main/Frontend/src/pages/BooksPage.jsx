import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  BookMarked,
  Users,
  DollarSign,
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../services/bookService";
import BookFormModal from "../components/books/BookFormModal";
import DeleteBookModal from "../components/books/DeleteBookModal";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

function BooksPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAllBooks = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      setLoadError("");
      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = getErrorMessage(error);

      if (error.response?.status === 401) {
        logout();
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      setLoadError(message);
      if (isManualRefresh) {
        toast.error(message);
      }
    } finally {
      if (isManualRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return books;
    }

    return books.filter((book) => {
      const title = book.title?.toLowerCase() ?? "";
      const author = book.author?.toLowerCase() ?? "";
      const year = String(book.publishedYear ?? "").toLowerCase();

      return (
        title.includes(query) || author.includes(query) || year.includes(query)
      );
    });
  }, [books, searchTerm]);

  const totalBooks = books.length;
  const totalAuthors = useMemo(
    () => new Set(books.map((book) => book.author).filter(Boolean)).size,
    [books],
  );
  const averagePrice = useMemo(() => {
    if (books.length === 0) {
      return 0;
    }

    const total = books.reduce((sum, book) => sum + Number(book.price || 0), 0);
    return total / books.length;
  }, [books]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const handleOpenAddModal = () => {
    setFormMode("add");
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setFormMode("edit");
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleCloseFormModal = () => {
    if (isSubmittingForm) {
      return;
    }

    setIsFormOpen(false);
    setSelectedBook(null);
  };

  const handleSubmitForm = async (payload) => {
    try {
      setIsSubmittingForm(true);

      if (formMode === "edit" && selectedBook?._id) {
        const updated = await updateBook(selectedBook._id, payload);
        setBooks((prev) =>
          prev.map((book) => (book._id === selectedBook._id ? updated : book)),
        );
        toast.success("Book updated successfully");
      } else {
        const created = await addBook(payload);
        setBooks((prev) => [created, ...prev]);
        toast.success("Book added successfully");
      }

      setIsFormOpen(false);
      setSelectedBook(null);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleOpenDeleteModal = (book) => {
    setBookToDelete(book);
    setIsDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteOpen(false);
    setBookToDelete(null);
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete?._id) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteBook(bookToDelete._id);

      setBooks((prev) => prev.filter((book) => book._id !== bookToDelete._id));
      setIsDeleteOpen(false);
      setBookToDelete(null);

      toast.success(result?.message || "Book deleted successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }

      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const showEmptyLibrary = !isLoading && !loadError && books.length === 0;
  const showNoSearchResults =
    !isLoading && !loadError && books.length > 0 && filteredBooks.length === 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-105 w-105 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-52 h-105 w-105 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Navigation */}
        <header className="mb-6 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                <BookOpen size={23} />
              </div>

              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                  Library Management
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Your personal collection dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  L
                </div>

                <div className="pr-2">
                  <p className="text-sm font-semibold text-slate-800">
                    Library User
                  </p>

                  <p className="text-xs text-emerald-600">Authenticated</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-indigo-950 to-violet-900 px-6 py-9 text-white shadow-2xl shadow-indigo-200/50 sm:px-9 sm:py-11 lg:px-12">
          <div className="pointer-events-none absolute -right-14 -top-20 opacity-[0.07]">
            <BookOpen size={285} strokeWidth={1.2} />
          </div>

          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-indigo-100 backdrop-blur">
                LIBRARY DASHBOARD
              </span>

              <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Organize knowledge.
                <span className="block text-indigo-300">
                  Manage every book.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Keep your growing collection organized, searchable, and always
                up to date from one beautifully simple dashboard.
              </p>
            </div>

            {/* Hero information card — no duplicate Add Book button */}
            <div className="hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-lg lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-indigo-200">
                  <BookMarked size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                    Collection Status
                  </p>

                  <p className="mt-0.5 text-lg font-bold text-white">
                    {totalBooks} {totalBooks === 1 ? "Book" : "Books"}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-px bg-white/10" />

              <p className="mt-4 text-sm leading-6 text-slate-300">
                Search, update, and manage your complete library collection from
                the section below.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="relative z-10 grid gap-4 py-6 sm:grid-cols-2 lg:-mt-7 lg:grid-cols-3 lg:px-6">
          <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Books
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {totalBooks}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Books in your collection
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <BookMarked size={22} />
              </div>
            </div>
          </article>

          <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Authors
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {totalAuthors}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Unique authors represented
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                <Users size={22} />
              </div>
            </div>
          </article>

          <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Average Price
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  ₹
                  {averagePrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Average collection value
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <DollarSign size={22} />
              </div>
            </div>
          </article>
        </section>

        {/* Collection panel */}
        <section className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {/* Collection header */}
          <div className="border-b border-slate-200 bg-linear-to-r from-white via-slate-50/70 to-indigo-50/40 px-5 py-6 sm:px-7">
            <div className="space-y-5">
              {/* Title row */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                    <BookOpen size={22} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                        Book Collection
                      </h2>

                      {!isLoading && !loadError ? (
                        <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                          {filteredBooks.length}{" "}
                          {filteredBooks.length === 1 ? "book" : "books"}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      Search, organize, and manage every book in your
                      collection.
                    </p>
                  </div>
                </div>

                {!isLoading && !loadError && totalBooks > 0 ? (
                  <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm md:flex">
                    <BookMarked size={16} className="text-indigo-600" />

                    <span className="text-sm text-slate-500">
                      Total collection
                    </span>

                    <span className="font-bold text-slate-900">
                      {totalBooks}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Toolbar */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_132px_170px]">
                  <label className="relative block min-w-0">
                    <span className="sr-only">Search books</span>

                    <Search
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by title, author, or published year..."
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </label>

                  <button
                    type="button"
                    title="Refresh books"
                    onClick={() => fetchAllBooks(true)}
                    disabled={isRefreshing || isLoading}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw
                      size={17}
                      className={isRefreshing ? "animate-spin" : ""}
                    />

                    {isRefreshing ? "Refreshing" : "Refresh"}
                  </button>

                  {/* Only primary Add Book button */}
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200"
                  >
                    <Plus size={18} />
                    Add Book
                  </button>
                </div>

                {searchTerm.trim() ? (
                  <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 px-1 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                      Showing{" "}
                      <span className="font-bold text-slate-800">
                        {filteredBooks.length}
                      </span>{" "}
                      {filteredBooks.length === 1 ? "result" : "results"} for{" "}
                      <span className="font-semibold text-indigo-700">
                        “{searchTerm}”
                      </span>
                    </p>

                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="self-start rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 sm:self-auto"
                    >
                      Clear search
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Collection content */}
          <div className="p-5 sm:p-7">
            {/* Loading */}
            {isLoading ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 px-4 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-indigo-100" />

                  <div className="relative h-11 w-11 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900">
                  Loading your collection
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  We are fetching the latest books from your library.
                </p>
              </div>
            ) : null}

            {/* Error */}
            {!isLoading && loadError ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/70 px-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <RefreshCw size={24} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-red-950">
                  Unable to load books
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-red-700">
                  {loadError}
                </p>

                <button
                  type="button"
                  onClick={() => fetchAllBooks()}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            ) : null}

            {/* Empty library */}
            {showEmptyLibrary ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-linear-to-b from-indigo-50/70 to-white px-5 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-inner">
                  <BookOpen size={34} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  Your library is waiting
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Use the Add Book button above to create your first library
                  record.
                </p>
              </div>
            ) : null}

            {/* No search results */}
            {showNoSearchResults ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                  <Search size={28} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No matching books
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">
                  No results were found for{" "}
                  <span className="font-semibold text-slate-700">
                    “{searchTerm}”
                  </span>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-5 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Clear Search
                </button>
              </div>
            ) : null}

            {!isLoading && !loadError && filteredBooks.length > 0 ? (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                            Book
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                            Author
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                            Published
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                            Price
                          </th>

                          <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredBooks.map((book) => (
                          <tr
                            key={book._id}
                            className="group transition hover:bg-indigo-50/40"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                                  <BookOpen size={19} />
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-xs truncate text-sm font-bold text-slate-900">
                                    {book.title}
                                  </p>

                                  <p className="mt-0.5 text-xs text-slate-400">
                                    Library record
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-sm font-medium text-slate-600">
                              {book.author}
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                                {book.publishedYear}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-slate-900">
                              ₹
                              {Number(book.price).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(book)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenDeleteModal(book)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                  {filteredBooks.map((book) => (
                    <article
                      key={book._id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="border-b border-slate-100 bg-linear-to-br from-slate-50 to-indigo-50/60 p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                            <BookOpen size={21} />
                          </div>

                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-950">
                              {book.title}
                            </h3>

                            <p className="mt-1 truncate text-sm text-slate-500">
                              by {book.author}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold text-slate-400">
                              Published
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {book.publishedYear}
                            </p>
                          </div>

                          <div className="rounded-xl bg-emerald-50 p-3">
                            <p className="text-xs font-semibold text-emerald-600/70">
                              Price
                            </p>

                            <p className="mt-1 text-sm font-bold text-emerald-700">
                              ₹
                              {Number(book.price).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(book)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(book)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>
      </div>

      <BookFormModal
        isOpen={isFormOpen}
        mode={formMode}
        book={selectedBook}
        isSubmitting={isSubmittingForm}
        onClose={handleCloseFormModal}
        onSubmit={handleSubmitForm}
      />

      <DeleteBookModal
        isOpen={isDeleteOpen}
        book={bookToDelete}
        isSubmitting={isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteBook}
      />
    </main>
  );
}

export default BooksPage;
