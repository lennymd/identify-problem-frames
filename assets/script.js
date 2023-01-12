async function main() {
  console.log('test');

  let container = d3.select('#container');
  let _status = d3.select('#status');
  let submit_button = d3.select('#submit_button');
  let file_selector = d3.select('#file_selector');

  submit_button.on('click', () => {
    console.log('clicked');
    // check if #file_selector has any files

    let file = file_selector.node().files[0];
    console.log(file);
    if (file) {
      console.log('file included');
      // Check the filetype. It should be text/csv or something that can be read as a CSV.
      if (!file.type) {
        _status.textContent = 'Error: The File.type property does not appear to be supported on this browser.';
        return;
      }
      if (!file.type.match('text/*')) {
        _status.textContent = 'Error: The selected file does not appear to be a Text file.';
        return;
      }
      //  Read the file and display contents in #container
      let reader = new FileReader();
      reader.onload = function (e) {
        let data = d3.csvParse(reader.result);
        // TODO add accessors for each column
        const sepal_length = d => d['sepal.length'];
        const sepal_width = d => d['sepal.width'];
        const petal_length = d => d['petal.length'];
        const petal_width = d => d['petal.width'];
        const variety = d => d['variety'];

        // go through each line of the file to process and display things.
        data.forEach((row, indx) => {
          // container.append('p').text(`${indx}: ${line}`);
          container
            .append('p')
            .attr('class', 'row')
            .attr('id', `line-${indx}`)
            .text(
              `${indx}: ${sepal_length(row)}, ${sepal_width(row)}, ${petal_length(row)}, ${petal_width(row)}, ${variety(
                row,
              )}`,
            );
          if (sepal_length(row) < 5) {
            d3.select(`#line-${indx}`).classed('special', true);
          }
        });
      };
      reader.readAsText(file);
    } else {
      // if no file, alert user to select a file
      alert('Please select a file before hitting submit');
    }
  });
}

main();
