class CreateScenarios < ActiveRecord::Migration
  def change
    create_table :scenarios do |t|
      t.belongs_to :family, index: true
      t.string :title
      t.string :description
      t.datetime :created_at
      t.datetime :updated_at
    end
  end
end
