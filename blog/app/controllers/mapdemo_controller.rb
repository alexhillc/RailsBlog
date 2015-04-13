class MapdemoController < ApplicationController

def index
  @mapdemo = Mapdemo.new(params[:mapdemo])
 
  @mapdemo.save
  #redirect_to index
	
end


def new
end

def show

end

end
