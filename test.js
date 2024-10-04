function longestCommonPrefix(strs) {
  if (strs.length === 0) {
    console.log("No strings in the input array.");
    return "";
  }

  // Start with the first string as the initial prefix
  let prefix = strs[0];
  console.log(`Initial prefix: ${prefix}`);

  // Iterate over the remaining strings
  for (let i = 1; i < strs.length; i++) {
    console.log(`Comparing prefix with: ${strs[i]}`);

    // Shorten the prefix until it matches the start of strs[i]
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, prefix.length - 1);
      console.log(`Updated prefix: ${prefix}`);

      if (prefix === "") {
        console.log("No common prefix found.");
        return "";
      }
    }
  }

  console.log(`Final common prefix: ${prefix}`);
  return prefix;
}
const words = ["flower", "flow", "flight"];
console.log(longestCommonPrefix(words));
