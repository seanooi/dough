require 'csv'
require "sinatra/activerecord/rake"
require "./server"

require_relative 'lib/models/stock'

desc "Default"
task :default do
	puts "No task"
end

desc "CSV"
task :fetch_stocks do
	csv = ['files/AMEX.csv', 'files/NASDAQ.csv', 'files/NYSE.csv']
	csv.each do |c|
		Stock.fetch_from(c)
	end
end