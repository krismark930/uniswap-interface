#!/bin/bash
set -e

function update_address {
    echo
    echo "Update address $1 to '$2'"
    files=$(grep --include '*.ts' --include '*.js' -r  "\<$1\>\s\+=\s\+[\"']0x[0-9a-zA-Z]\+[\"']" src/ node_modules/@uniswap/)
    echo "$files"
    echo "$files" | cut -d':' -f1 | uniq | xargs sed -i "s/\(\<$1\>\s\+=\s\+[\"']\)\(0x[0-9a-zA-Z]\+\)\([\"']\)/\\1$2\\3/g"
}

# Contracts from "uniswap-governance" repository
# You can get actual contracts addresses using `deploy contracts` test.
# To run this tests only execute in working directory of repository:
#    `node node_modules/mocha/bin/mocha --grep " deploy contracts$"`
update_address UNI_ADDRESS 0x51179e1BCe688B1c8047B01422FB0f8634E77eb3
update_address TIMELOCK_ADDRESS 0x2f54D2d443e82275BBaCB12C68B0a8e67e1C6db7
update_address GOVERNANCE_ADDRESS 0x641fED19CdfEf0f392F7572264CF6328F6D18774

# Compile and deploy multicall contract from "https://github.com/makerdao/multicall"
update_address MULTICALL_ADDRESS 0x5a379A80Ae648748baBcE274944Da26c6aa9bF9f

# Contracts from "uniswap-v2-periphery" repository
# You can get actial contract addresses using `deploy contracts` test.
# To run this tests only execute in working directory of repository:
#    `node node_modules/mocha/bin/mocha --grep " deploy contracts$"`
update_address MIGRATOR_ADDRESS 0x096bE363182547F2b55581B995bFeF97B9122438
update_address FACTORY_ADDRESS 0xD0803cDd4962432E0A5bA374E287Caed31DE8596
update_address ROUTER1_ADDRESS 0xB6Decc616aD58af849Efacf55d3b897A4D2e2b6b
update_address ROUTER_ADDRESS 0x686D81237C6319e3E482893C70BEF01EeF8a9423
update_address V1_FACTORY_ADDRESS 0xFBE1e2fA58798508Dbad3EbD0890D59F1559E7cf
update_address WETH_ADDRESS 0xf5Ce1EeDc2d7108cb4cEaA552eA35146721f2dcb
