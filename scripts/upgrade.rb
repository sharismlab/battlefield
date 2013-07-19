#! /usr/bin/env ruby

require 'yaml'

provision = YAML.load_file(ARGV[0])
provision.each_key do |lname|
  layer = provision[lname]
  layer.each do |entry|
    entry.each_key do |name|
      version = entry[name]
      invoker = "#{ENV['BTF_HOME']}/scripts/#{name}/upgrade.sh"
      IO.popen [invoker, version] if File.file?(invoker)
    end
  end
end




