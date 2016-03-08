require 'test_helper'

class AccountmanagementControllerTest < ActionController::TestCase
  test "should get createaccount" do
    get :createaccount
    assert_response :success
  end

  test "should get updatepassword" do
    get :updatepassword
    assert_response :success
  end

end
