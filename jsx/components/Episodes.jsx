/** @jsx React.DOM */
var Episodes = React.createClass({
  getInitialState: function() {
    return {
      episodes: []
    }
  },
  render: function() {
    return (
      <div className="row">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="col-xs-3 text-right">
                <h4>Episode format</h4>
              </th>
              <th className="col-xs-8">
                <input
                  id="episode-format"
                  ref="format"
                  type="text"
                  className="form-control"
                  defaultValue={this.props.app.format}
                  onKeyDown={this.checkReturn}
                  onChange={this.updateFormat}
                  onBlur={AppState.update} />
              </th>
              <th className="col-xs-8">
                <span className="glyphicon glyphicon-info-sign h4" onClick={this.toggleFormatHelp}></span>
              </th>
            </tr>
            <FormatHelp ref="formatHelp" style={{display: 'none'}}/>
          </thead>
          <tbody>
          {this.state.episodes.map(function(episode, index) {
            return (
              <Episode key={index} name={episode} />
            )
          }, this)}
          </tbody>
        </table>
      </div>
    );
  },

  componentDidMount: function() {
    theMovieDb.tvSeasons.getById({
      "id":this.props.show.id,
      "season_number": this.props.app.season,
      "language": this.props.app.language
    }, this.showEpisodes, this.showError);
  },

  componentWillReceiveProps: function(nextProps) {
    theMovieDb.tvSeasons.getById({
      "id": nextProps.show.id,
      "season_number": nextProps.app.season,
      "language": nextProps.app.language
    }, this.showEpisodes, this.showError);
  },

  showEpisodes: function(json) {
    json = JSON.parse(json);
    var self = this,
        episodes = [],
        dict = {
          'show': this.props.show.name,
          'season': this.props.app.season,
        };

    function zerofill(number) {
      if(self.props.app.zerofill > 0) {
        var pad = "", len = (""+number).length;
        for(var i=0; i<(self.props.app.zerofill-len+1); i++) pad += "0";
        number = pad+number;
      }
      return number;
    };

    dict.season = zerofill(dict.season);

    function replace( text ) {
      text = text.replace(new RegExp("[(]([a-z ]*)[)]", "gim"), function(a, b) {
        return dict[b.toLowerCase()] || a;
      });
      return text;
    }

    function buildEpisodeName(episode) {
      dict.episode = zerofill(episode.episode_number);
      dict.title = episode.name;
      episodes.push(replace(self.props.app.format));
    }

    json.episodes.forEach(function(episode) {
      buildEpisodeName(episode);
    });

    this.setState({episodes: episodes});
  },

  showError: function(json) {
    json = JSON.parse(json);
    console.log('Episodes.showError', json);
  },

  checkReturn: function(e) {
    var format = e.target.value;
    AppState.app.format = format;
    if(e.nativeEvent.keyCode == 13) AppState.update();
  },

  updateFormat: function(e) {
    var format = e.target.value;
    AppState.app.format = format;
  },

  toggleFormatHelp: function() {
    var visible = this.refs.formatHelp.getDOMNode().style.display == 'none' ? false : true;
    if(visible) this.refs.formatHelp.getDOMNode().style.display = 'none';
    else this.refs.formatHelp.getDOMNode().style.display = 'table-row';
  },
});