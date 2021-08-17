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

import { Base32, Converter } from '@utils';

export interface RawAddress {
    addressWithoutChecksum: Uint8Array;
    checksum: Uint8Array;
}

export abstract class Address {
    constructor(public readonly rawAddress: RawAddress) {}

    /**
     * Ge address bytes
     */
    public abstract getAddressBytes(): Uint8Array;

    /**
     * Get address in the encoded format ex: NAR3W7B4BCOZSZMFIZRYB3N5YGOUSWIYJCJ6HDFH.
     *
     * @returns Encoded address string
     */
    public get encoded(): string {
        const padded = new Uint8Array(25);
        const bytes = this.getAddressBytes();
        padded.set(bytes);
        return bytes.length === 25 ? Base32.Base32Encode(padded) : Base32.Base32Encode(padded).slice(0, -1);
    }

    /**
     * Get address in plain format ex: SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3.
     *
     * @returns Decoded address string (Hexadecimal)
     */
    public get decode(): string {
        return Converter.uint8ToHex(this.getAddressBytes());
    }

    /**
     * Get address in pretty format ex: SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3.
     *
     * @returns Encoded address tring with separators
     */
    public pretty(): string {
        return this.encoded.match(/.{1,6}/g)!.join('-');
    }

    /**
     * Compares addresses for equality
     *
     * @param address - Encoded address to to compare
     * @returns True if the two addresses are the same
     */
    public equals(address: string): boolean {
        return this.encoded.toUpperCase() === address.toUpperCase();
    }

    /**
     * Return encoded address string.
     *
     * @returns Encoded address string
     */
    public toString(): string {
        return this.encoded;
    }
}
