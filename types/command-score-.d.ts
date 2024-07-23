declare module "command-score" {
  /**
   * Calculates a relevance score for a given string based on a search query.
   *
   * @param str - The string to be scored.
   * @param query - The search query to score against.
   * @param options - Optional configuration options.
   * @returns A number representing the relevance score. Higher scores indicate better matches.
   */
  function commandScore(
    _str: string,
    _query: string,
    _options?: {
      /**
       * If true, the scoring will be case-sensitive. Default is false.
       */
      caseSensitive?: boolean;
      /**
       * A string of characters to be considered as word separators. Default is " -_".
       */
      separators?: string;
      /**
       * If true, the scoring will consider the order of characters in the query. Default is true.
       */
      ordered?: boolean;
    }
  ): number;

  export = commandScore;
}
