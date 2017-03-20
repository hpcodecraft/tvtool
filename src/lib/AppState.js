const AppState = {
  app: {
    language: 'en',
    show: null,
    season: 1,
    format: '(show) - (season)x(episode) - (title)',
    zerofill: [0, 0],
    space: ' ',
  },
  update: function() {
    localStorage.setItem('episodehelper', JSON.stringify(this.app));
    // update.dispatch();
  },
  load: function() {
    var app = localStorage.getItem('episodehelper');
    if(null !== app && "undefined" !== app) this.app = JSON.parse(app);
  }
};

export default AppState;