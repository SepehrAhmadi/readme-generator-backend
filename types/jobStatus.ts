export type JobStatus =
  | "pending"
  | "fetching_metadata"
  | "fetching_file_tree"
  | "reading_files"
  | "generating_readme"
  | "completed"
  | "failed";
