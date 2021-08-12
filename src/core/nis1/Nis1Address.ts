/*
 * Copyright 2021 SYMBOL
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Address, RawAddress } from '@core';
import { Base32, Converter } from '@utils';

/**
 * The address structure describes an address with its network
 */
export class Nis1Address extends Address {
    /**
     * Constructor
     *
     * @param rawAddress - Raw address bytes
     */
    constructor(rawAddress: RawAddress) {
        super(rawAddress);
    }

    /**
     * Get the raw address byte with checksum bytes for Nis1 Address
     *
     * @returns Address bytes
     */
    public getAddressBytes(): Uint8Array {
        const { addressWithoutChecksum, checksum } = this.rawAddress;
        const address = new Uint8Array(addressWithoutChecksum.length + 4);
        address.set(addressWithoutChecksum, 0);
        address.set(checksum.subarray(0, 4), addressWithoutChecksum.length);
        return address;
    }

    /**
     * Create Nis1 Address object from encoded address string
     *
     * @param encodedAddress - Encoded address
     * @returns Nis1Address object
     */
    public static createFromString(encodedAddress: string): Nis1Address {
        const decoded = Base32.Base32Decode(encodedAddress);
        return new Nis1Address({
            addressWithoutChecksum: decoded.subarray(0, 21),
            checksum: decoded.subarray(21, 25),
        });
    }

    /**
     * Create Nis1 Address object from encoded address bytes
     *
     * @param addressBytes - address bytes
     * @returns Nis1Address object
     */
    public static createFromBytes(addressBytes: Uint8Array): Nis1Address {
        const padded = new Uint8Array(25);
        padded.set(addressBytes);
        return new Nis1Address({
            addressWithoutChecksum: padded.subarray(0, 21),
            checksum: padded.subarray(21, 25),
        });
    }

    /**
     * Create Nis1 Address object from decoded
     *
     * @param addressHex - address hex string
     * @returns Nis1Address object
     */
    public static createFromHex(addressHex: string): Nis1Address {
        const bytes = Converter.hexToUint8(addressHex);
        return Nis1Address.createFromBytes(bytes);
    }
}
