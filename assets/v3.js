// In v3 we read and process multiple text files. We use the functionality from v2 and v1 to load and process files, and in v3 we'll add the ability to see the conversation and the ngrams.

async function main() {
  console.log('v3 Hello World!');
  let container = d3.select('#container');
  let _status = d3.select('#status');
  let submit_button = d3.select('#submit_button');
  let file_selector = d3.select('#file_selector');
  let file_list = [];

  submit_button.on('click', () => {
    // process submit
    console.log(file_selector.node().files);
  });
}
main();
