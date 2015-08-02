# /etc/security/limits.conf
ulimit -n 51200

# /etc/sysctl.conf
# sysctl -p

# start shadowsocks
ssserver -c ss_config.json -d start
# ssserver -s 107.170.234.46 -p 8888 -k 18273645 -m aes-256-cfb --user nobody -d start
