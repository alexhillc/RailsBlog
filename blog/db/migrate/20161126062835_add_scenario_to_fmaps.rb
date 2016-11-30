class AddScenarioToFmaps < ActiveRecord::Migration
  def change
    add_reference :fmaps, :scenario, index: true
  end
end
