declare global {
  var mongoose: {
    conn: unknown;
    promise: Promise<unknown> | null;
  };
}

export {};
