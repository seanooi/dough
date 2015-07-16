import DS from 'ember-data';

export default DS.Model.extend({
	date: DS.attr('date'),
	open: DS.attr('number'),
	close: DS.attr('number'),
	low: DS.attr('number'),
	high: DS.attr('number'),
	average: DS.attr('number')
});
