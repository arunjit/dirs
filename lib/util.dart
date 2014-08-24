library dirs.util;

import "package:quiver/strings.dart";

/**
 * Returns the first non-empty string. If all arguments are empty, throws
 * an [ArgumentError].
 */
String firstNonEmpty(String s1, String s2, [String s3, String s4]) {
  if (!isBlank(s1)) return s1;
  if (!isBlank(s2)) return s2;
  if (!isBlank(s3)) return s3;
  if (!isBlank(s4)) return s4;
  throw new ArgumentError("All strings were empty");
}