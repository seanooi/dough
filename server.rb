require 'sinatra'
require 'sinatra/activerecord'
require 'yahoo_finance'
require 'stock_quote'

require_relative 'lib/models/stock'

configure do
	set :public_folder, File.expand_path('dist')
	set :database, {adapter: "sqlite3", database: "stocks.sqlite3"}
end

get '/api/stocks' do
	content_type :json

	if params[:symbol].nil?
		{stocks: Stock.all}.to_json
	else
		symbol = params[:symbol].downcase
		{stocks: Stock.where("lower(name) LIKE ?", "%#{symbol}%")}.to_json
	end
end

get '/api/prices' do
	content_type :json

	if params[:symbol].nil?
		{prices: []}.to_json
	else
		begin
			puts params[:symbol]
			data = YahooFinance.historical_quotes(params[:symbol], { start_date: Time.now-(24*60*60*30), end_date: Time.now })
			count = 0
			prices = data.collect do |t|
				count+=1
				{
					id: count,
					date: t.trade_date,
					open: t.open.to_f,
					close: t.close.to_f,
					low: t.low.to_f,
					high: t.high.to_f,
					average: (t.open.to_f + t.close.to_f + t.low.to_f + t.high.to_f) / 4
				}
			end
		rescue
			prices = []
		end
		{prices: prices}.to_json
	end
end

get '*' do
	send_file 'dist/index.html'
end