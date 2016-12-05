class RenameNameToEncryptedName < ActiveRecord::Migration
  def change
    rename_column :families, :name, :encrypted_name
  end
end
