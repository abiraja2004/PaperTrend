var PaperApp = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadPaperFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data['papers']});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadPaperFromServer();
  },
  handlePaperSubmit: function(paper) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: paper,
      success: function(data) {
        this.setState({data: data['papers']});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="container">
        <PaperSearchForm onPaperSubmit={this.handlePaperSubmit} />
        <PaperList data={this.state.data} />
      </div>
    );
  }
});

var PaperSearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var query = React.findDOMNode(this.refs.query).value.trim();
    var year = React.findDOMNode(this.refs.year).value.trim();
    /*if (!query || !year) {
      return;
    }*/
    this.props.onPaperSubmit({query: query, year: year});
    React.findDOMNode(this.refs.query).value = '';
    React.findDOMNode(this.refs.year).value = '';
    return;
  },
  handleKeyDown: function(event) {
    if (event.keyCode == 13 /*enter*/) {
      this.handleSubmit(event);
    }
  },
  componentDidMount: function() {
    $(document.body).on('keydown', this.handleKeyDown);
  },

  componentWillUnMount: function() {
    $(document.body).off('keydown', this.handleKeyDown);
  },
  render: function() {
    return (
      <div className="row">
        <form className="col m6 s12 offset-m3" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s6">
              <input id="query" type="text" ref="query" className="validate" />
              <label>Query</label>
            </div>
            <div className="input-field col s6">
              <input id="year" type="text" ref="year" className="validate" />
              <label>Year</label>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

var PaperList = React.createClass({
  render: function() {
    var paperNodes = this.props.data.map(function(paper, index) {
      return (
        <Paper title={paper.title} year={paper.year} key={index}>
        </Paper>
      );
    });
    return (
      <div className="row">
        <ul className="paperList">
          {paperNodes}
        </ul>
      </div>
    );
  }
});

var Paper = React.createClass({
  render: function() {
    return (
      <li className="paper"><h2>{this.props.title}</h2>{this.props.year}</li>
    );
  }
});

React.render(
  <PaperApp url="papers.json" />,
  document.getElementById('content')
);
