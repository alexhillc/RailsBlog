class Scenario < ActiveRecord::Base
  validates :title, presence: true
  belongs_to :family
  has_many :fmaps, dependent: :destroy
end
