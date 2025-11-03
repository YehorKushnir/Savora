import {Prisma} from '@prisma/client'

export const getVaults = async (db: Prisma.TransactionClient, sourceId: string, targetId: string) => {
    const [sourceVault, targetVault] = await Promise.all([
        db.vault.findUnique({where: {id: sourceId}}),
        db.vault.findUnique({where: {id: targetId}}),
    ])

    if (!sourceVault || !targetVault) throw new Error('Missing vaults')

    return {sourceVault, targetVault}
}