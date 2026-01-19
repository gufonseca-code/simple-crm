import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {

    const user = await prisma.user.create({
        data: {
            name: "Usuário teste",
            email: "teste@crm.com",
            password: "123456"
        }
    })

    const client = await prisma.client.create({
        data: {
            name: "Empresa exemplo",
            email: "contato@empresa.com",
            phone: "11999999999",
            userId: user.id
        }
    })

    const lead1 = await prisma.lead.create({
        data: {
            title: "Website institucional",
            status: "NEW",
            value: 5000,
            userId: user.id,
            clientId: client.id
        }
    })

    const lead2 = await prisma.lead.create({
        data: {
            title: "Sistema interno",
            status: "PROPOSAL_SENT",
            value: 12000,
            userId: user.id,
            clientId: client.id
        }
    })

    await prisma.task.create({
        data: {
            title: "Ligar para o cliente",
            completed: false,
            userId: user.id,
            leadId: lead1.id
        }
    })
}

main().catch((e) => {
    console.error(e)
}).finally(async () => {
    await prisma.$disconnect()
})