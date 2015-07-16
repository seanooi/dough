#Dough Stock

##Setup
1. Open a terminal and `cd` into the _dough_ folder.
2. Run `npm install` to install required node modules.
3. Run `bower install` to install required bower components.
4. Run `bundle install` to install required gems.
5. Run `rake db:create` to create an empty database.
6. Run `rake db:migrate` to create tables inside the database.
7. Run `rake fetch_stocks` to import all stock info into the database.

##Running The Server
1. In terminal, make sure you're still in the _dough_ folder.
2. Run `ruby server.rb` to start the backend server. _(Take note the of port number. Assuming it is **4567**)_
3. Open a new terminal window and `cd` into the _dough-stock_ folder.
4. Run `ember server --proxy http://localhost:4567` _(Take not the address it is serving on. Assuming it is **http://localhost:4200**)_
5. Visit **http://localhost:4200** on your web browser.