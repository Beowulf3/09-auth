"use client";

import css from "./notes.module.css";

interface ErrorProps {
  error: Error;
}

const Error = ({ error }: ErrorProps) => {
  return (
    <p className={css.error}>
      Could not fetch the list of notes. {error.message}
    </p>
  );
};

export default Error;
