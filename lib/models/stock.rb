class Stock < ActiveRecord::Base
	def self.fetch_from(path)
		csv_file = File.read(path)
		csv = CSV.parse(csv_file, :headers => true, :header_converters => :symbol)
		csv.each do |row|
			stock = row.to_hash
			Stock.create(
				name: stock[:name],
				symbol: stock[:symbol]
				)
			
			puts "Created stock: #{stock[:name]}"
		end
	end
end