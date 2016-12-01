class Family < ActiveRecord::Base
  validates :name, presence: true
  belongs_to :user
  has_many :scenarios, dependent: :destroy
end
