class Family < ActiveRecord::Base
  validates :encrypted_name, presence: true
  belongs_to :user
  has_many :scenarios, dependent: :destroy

  attr_accessor :name
  attr_accessor :password
end
