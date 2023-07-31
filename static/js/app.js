// Fetch the JSON data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {

  // Dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  let names = data.names;

  names.forEach((name) => {
    dropdownMenu.append("option").text(name).property("value");
  });

  // Initial bar chart, bubble charts, Demo Info, 
  updateBarChart(data, names[0]);
  updateBubbleChart(data, names[0]);
  updateMetaData(data, names[0]);

  // Dropdown change handler
  dropdownMenu.on("change", function() {
    let selectedOption = d3.select(this).property("value");
    updateBarChart(data, selectedOption);
    updateBubbleChart(data, selectedOption);
    updateMetaData(data, selectedOption);
  });

});

function updateBarChart(data, selectedOption) {
  // Get selected sample data
  let samples = data.samples;
  let selectedSample = samples.filter(sample => sample.id === selectedOption)[0];

  // Top 10 OTUs
  let otus = selectedSample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`);
  let sampleValues = selectedSample.sample_values.slice(0, 10);
  let otuLabels = selectedSample.otu_labels.slice(0, 10);

  // Bar chart
  let trace = {
    x: sampleValues,
    y: otus,
    text: otuLabels,
    type: "bar",
    orientation: "h",
    marker: {
      color: 'rgba(58,200,225,0.6)',
      line: {
        color: 'rgba(58,200,225,1.0)',
        width: 1.5
      }
    }
  };

  let layout = {
    title: 'Top 10 OTUs',
    xaxis: {title: 'Sample Values'},
    yaxis: {autorange: "reversed"}
  };

  Plotly.newPlot("bar", [trace], layout);
}

//Bubble Chart
function updateBubbleChart(data, selectedOption) {
    // Get selected sample data
    let samples = data.samples;
    let selectedSample = samples.filter(sample => sample.id === selectedOption)[0];
  
    let otuIds = selectedSample.otu_ids;
    let sampleValues = selectedSample.sample_values;
    let otuLabels = selectedSample.otu_labels;
  
    // Bubble chart
    let trace = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      text: otuLabels,
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    };
  
    let layout = {
      title: 'Sample Values by OTU ID',
      showlegend: false,
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Sample Values'},
      height: 600,
      width: 1200
    };
  
    Plotly.newPlot("bubble", [trace], layout);
  }

// Demographic Info
  function updateMetaData(data, selectedOption) {
    let metadata = data.metadata;
    let selectedMetaData = metadata.filter(sample => sample.id == selectedOption)[0];
  
    let metaDataDiv = d3.select("#sample-metadata");
  
    // Clear existing metadata
    metaDataDiv.html("");
  
    // Add each key-value pair to the metadata div
    Object.entries(selectedMetaData).forEach(([key, value]) => {
      metaDataDiv.append("h5").text(`${key}: ${value}`);
    });
  }