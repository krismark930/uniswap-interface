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
update_address UNI_ADDRESS 0x665bAc809027F664a74E3977a4842b40841EB574
update_address TIMELOCK_ADDRESS 0x7fAfd1b07AA160053DcC7e4df5228d4B566c9D24
update_address GOVERNANCE_ADDRESS 0xcE24765430E7C244021de3bdA2Fa6A15ee499d97

# Compile and deploy multicall contract from "https://github.com/makerdao/multicall"
update_address MULTICALL_ADDRESS 0x7cc33357FfCFaF6ac5CD66cEE1944B5d7AF9facB

# Contracts from "uniswap-v2-periphery" repository
# You can get actial contract addresses using `deploy contracts` test.
# To run this tests only execute in working directory of repository:
#    `node node_modules/mocha/bin/mocha --grep " deploy contracts$"`
update_address MIGRATOR_ADDRESS 0xF231A5C3bB9ee7D5247359b59C94b0eBac7E1f1b
update_address FACTORY_ADDRESS 0x1814A26B21CEdf2A87dDd1d9a8524173920e30Db
update_address ROUTER1_ADDRESS 0x7c84D49d832d33308D3deA909246CF0930D6D08F
update_address ROUTER_ADDRESS 0x2405cE5ce29c0E834764c3Dd2078e71c4dBc77b5
update_address V1_FACTORY_ADDRESS 0xA78f20fFE46a3e947371bb7D45B78c2953060400
update_address WETH_ADDRESS 0x5A4add9B60D8E8060594E978dAF3e3e656CE2b02