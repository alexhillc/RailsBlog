class Family < ActiveRecord::Base
  validates :encrypted_name, presence: true
  belongs_to :user
  has_many :scenarios, dependent: :destroy
end
