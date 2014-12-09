require 'test_helper'

class PostTest < ActiveSupport::TestCase
   test "the truth" do
     assert true
   end
   
   test "should not save post without title" do
	  post = Post.new
	  assert_not post.save, "Saved the post without a title"
	end
end

class Post < ActiveRecord::Base
  validates :title, presence: true
end
