class AddFrozenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :account_frozen, :boolean, :default => false
  end
end
