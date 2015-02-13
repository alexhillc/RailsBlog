class MapdemoController < ApplicationController

def index
	
end


def create
  @mapdemo = Mapdemo.new(params[:mapdemo])
 
  @mapdemo.save
  redirect_to @mapdemo
end

end
