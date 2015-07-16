import Ember from 'ember';

export default Ember.Route.extend({
	selectedStock: undefined,
	symSearch: '',
	stockSymbol: '',
	stockName: '',
	queriedPrices: [],
	priceArray: [],
	setupController: function(controller, model) {
		controller.set('model', model);
		
		if (this.stockSymbol !== '') {
			this.queriedPrices = this.store.query('price', {symbol: this.stockSymbol});
			this.loop();
		}

		controller.set('price', this.queriedPrices);
	},
	model: function() {
		if(this.symSearch === '') {
			return [];
		}
		else {
			return this.store.query('stock', {symbol: this.symSearch});
		}
	},
	actions: {
		searchSymbol: function(symbol) {
			this.symSearch = symbol;
			this.refresh();
		},
		getStock: function(stock) {
			if(this.selectedStock !== undefined) {
				this.selectedStock.set('isSelected', false);
			}
			stock.set('isSelected', true); 
			this.selectedStock = stock;
			this.stockSymbol = stock.get('symbol');
			this.stockName = stock.get('name');
			this.refresh();
		}
	},
	loop: function() {
		var self = this;
		var data = self.queriedPrices;
		self.priceArray = [];

		if(typeof data.then === 'function') {
			data.then(function(stocks) {
				var prices = stocks.toArray();
				for (var i = 0; i < prices.length; i++) {
					self.priceArray.unshift({
						date: prices[i].get('date'),
						average: prices[i].get('average'),
					});
				}
				self.lineChart();
			});
		}
	},
	lineChart: function() {
		d3.selectAll("svg").remove();

		if (this.priceArray.length > 0) {
			this.controller.set('stockName', this.stockName);
			var margin = {top: 40, right: 20, bottom: 30, left: 60},
			    width = 800 - margin.left - margin.right,
			    height = 400 - margin.top - margin.bottom;

			var dateFormatter = d3.time.format("%-m/%-d");

			var x = d3.time.scale()
			    .range([0, width]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom")
			    .tickFormat(dateFormatter);

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");

			var line = d3.svg.line()
			    .x(function(d) { return x(d.date); })
			    .y(function(d) { return y(d.average); });

			
			var svg = d3.select(".chart").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var data = this.priceArray;

			data.forEach(function(d) {
				d.average = +d.average;
			});

			x.domain(d3.extent(data, function(d) { return d.date; }));
			y.domain(d3.extent(data, function(d) { return d.average; }));

			svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis);

			svg.append("g")
			  .attr("class", "y axis")
			  .call(yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Price ($)");

			svg.append("path")
			  .datum(data)
			  .attr("class", "line")
			  .attr("d", line);
		}
		else {
			this.controller.set('stockName', this.stockName + " (No data available)");
		}
	}
});
