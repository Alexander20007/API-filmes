#!/bin/bash
echo "🔴 Matando processos antigos..."
pkill -9 node
sleep 2

echo "🔍 Verificando porta 3000..."
if lsof -i :3000 > /dev/null; then
    echo "❌ Porta ainda ocupada! Matando..."
    lsof -i :3000 | grep node | awk '{print $2}' | xargs kill -9
    sleep 2
fi

echo "✅ Porta liberada!"
echo "🚀 Iniciando API..."
npm run dev
