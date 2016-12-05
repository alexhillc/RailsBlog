class ChangeEncryptedNameTypeInFamilies < ActiveRecord::Migration
  def up
    change_column :families, :encrypted_name, :text
  end
  
  def down
    change_column :families, :encrypted_name, :string
  end
end
