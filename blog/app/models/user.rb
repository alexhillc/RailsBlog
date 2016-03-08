class User < ActiveRecord::Base
	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
		:recoverable, :rememberable, :trackable, :validatable

	attr_accessor :password
	validates_confirmation_of :password
	validates :email, uniqueness: true
	validates :password, length: { minimum: 8 }
	before_save :encrypt_password
	before_create { generate_token(:auth_token) }
  
	def generate_token(column)
		begin
			self[column] = SecureRandom.urlsafe_base64
    		end while User.exists?(column => self[column])
	end
  
	def encrypt_password
		if password.present?
			self.password_salt = BCrypt::Engine.generate_salt
			self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
		end
	end

	# This changes the password only when the password is changed. As opposed to before_save
	# which always generates a new salt and requires the password whenever updating the user
	#def password=(new_password)
	#	encrypt_password
	#end

	 def send_password_reset
	 	generate_token(:password_reset_token)
	 	self.password_reset_sent_at = Time.zone.now
	 	save!(validate: false)
	 	UserMailer.password_reset(self).deliver
	 end

	def self.authenticate(email, password)
		user = User.where(email: email).first
		if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
			user
		else
			nil
		end
	end
end
