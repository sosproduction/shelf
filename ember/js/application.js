
// Ember Appliction.js

// Create a new Ember Application
window.Todos = Ember.Application.create();

// Application Adapter
Todos.ApplicationAdapter = DS.LSAdapter.extend({
  namespace: 'todos-emberjs'
});