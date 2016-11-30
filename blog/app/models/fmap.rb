class Fmap < ActiveRecord::Base
    validates :title, presence: true
    belongs_to :scenario
end
