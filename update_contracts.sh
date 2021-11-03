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
update_address UNI_ADDRESS 0xC59dEC342962109CB5F3bCF14e088347DFDC5e72
update_address TIMELOCK_ADDRESS 0xA338c7B902107c3a6440Ea5f769eFB2be3887107
update_address GOVERNANCE_ADDRESS 0x9da2698F1DC5D581a52549afFf5e843C8463A428

# Compile and deploy multicall contract from "https://github.com/makerdao/multicall"
update_address MULTICALL_ADDRESS 0xD1a1E04aD4945fC06026Bcb73Be6667359344a34

# Contracts from "uniswap-v2-periphery" repository
# You can get actial contract addresses using `deploy contracts` test.
# To run this tests only execute in working directory of repository:
#    `node node_modules/mocha/bin/mocha --grep " deploy contracts$"`
update_address MIGRATOR_ADDRESS 0x9A15E72De579adE421Edd164299eea0A8a266e13
update_address FACTORY_ADDRESS 0x59CCE85A85621b2834aA60fC35cD3cF16D59EE91
update_address ROUTER1_ADDRESS 0x7a0b185b36cF65Bd4184a3Ea679357B11076D6B3
update_address ROUTER_ADDRESS 0xF88FC92Dd4811Fa78E39330fD71d5D47aB0f352F
update_address V1_FACTORY_ADDRESS 0x2EBFE6747D922B1a4E45612440E3D4C157470c32
update_address WETH_ADDRESS 0x636693fc6c72DB146a2b8Eeb6ce758471B0011ea
