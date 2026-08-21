import React, { useState } from 'react';
import {
  Github,
  CheckCircle2,
  Copy,
  Terminal,
  FileCode,
  ExternalLink,
  Sparkles,
  X,
  Server,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

interface GitHubPagesDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubPagesDeployGuideModal: React.FC<GitHubPagesDeployGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'actions' | 'manual' | 'node20'>('actions');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 3000);
  };

  const workflowYaml = `# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js 22 (LTS)
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: 📦 Install dependencies
        run: npm install

      - name: 🔨 Build Vite SPA (Relative Base)
        run: npx vite build --base=./

      - name: 🌐 Configure GitHub Pages
        uses: actions/configure-pages@v5

      - name: 📤 Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: 🚀 Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const gitCommands = `# 1. Inicialize o repositório git local (se ainda não tiver feito)
git init
git add .
git commit -m "feat: Jiu-Jitsu Hub com Lembretes Push e deploy no GitHub Pages"

# 2. Conecte ao seu repositório no GitHub
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# 3. Envie para o GitHub (o GitHub Actions fará o build e deploy automático com Node 20)
git push -u origin main
`;

  const buildCommand = `npm run build:gh-pages`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        id="github-pages-modal-content"
        className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 p-0.5 shadow-lg border border-zinc-700">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Publicar no GitHub Pages
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/30">
                  Node 22 LTS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Guia e automação CI/CD com GitHub Actions para hospedar o Jiu-Jitsu Hub gratuitamente
              </p>
            </div>
          </div>

          <button
            id="btn-close-github-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="px-6 pt-4 border-b border-zinc-900 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('actions')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'actions'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>GitHub Actions Automático (Recomendado)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('manual')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'manual'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Comandos Git & Passo a Passo</span>
          </button>

          <button
            onClick={() => setActiveSubTab('node20')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'node20'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Node 22 LTS & Vite</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {activeSubTab === 'actions' && (
            <div className="space-y-5 animate-fade-in">
              {/* Ready Workflow Callout */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        Workflow do GitHub Actions já configurado!
                      </h4>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        O arquivo <code className="text-amber-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">.github/workflows/deploy.yml</code> já foi criado no projeto com <strong>Node 22 LTS</strong> e compilação otimizada para o GitHub Pages (sem dependência de lockfile rígido).
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-copy-workflow-yaml"
                    onClick={() => copyToClipboard(workflowYaml, 'yaml')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 shrink-0 transition-all"
                  >
                    {copiedStep === 'yaml' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copiar YAML</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3 Step Deployment Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider">
                  Como ativar em 3 passos simples no GitHub:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                      1
                    </div>
                    <h5 className="text-xs font-bold text-white">Criar Repositório</h5>
                    <p className="text-[11px] text-zinc-400">
                      Crie um novo repositório no seu GitHub (público ou privado) e faça o push do código.
                    </p>
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                      2
                    </div>
                    <h5 className="text-xs font-bold text-white">Configurar Pages</h5>
                    <p className="text-[11px] text-zinc-400">
                      Vá em <strong>Settings</strong> &gt; <strong>Pages</strong> e em <em>Build and deployment</em> selecione <strong>Source: GitHub Actions</strong>.
                    </p>
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center">
                      3
                    </div>
                    <h5 className="text-xs font-bold text-white">Deploy Automático</h5>
                    <p className="text-[11px] text-zinc-400">
                      O GitHub Actions compila com Node 20 e publica seu app em <code className="text-amber-300 text-[10px]">https://seu-usuario.github.io/repo</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Snippet Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 font-mono flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    .github/workflows/deploy.yml (Node 20)
                  </span>
                  <span className="text-[10px] text-zinc-500">Pronto para commit</span>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 overflow-x-auto text-[11px] font-mono text-zinc-300 leading-relaxed max-h-56">
                  <pre>{workflowYaml}</pre>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'manual' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    Comandos no Terminal para Subir o Projeto
                  </h4>
                  <button
                    id="btn-copy-git-commands"
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 transition-all"
                  >
                    {copiedStep === 'git' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copiar Comandos</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 overflow-x-auto text-xs font-mono text-amber-400 leading-relaxed">
                  <pre>{gitCommands}</pre>
                </div>
              </div>

              {/* Local Build Command */}
              <div className="space-y-2 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">Testar o Build Estático Localmente:</h5>
                    <p className="text-[11px] text-zinc-400">Gera a pasta <code className="text-amber-400">dist/</code> pronta com caminhos relativos.</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(buildCommand, 'build')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                  >
                    {copiedStep === 'build' ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="bg-zinc-950 px-3 py-2 rounded-xl text-xs font-mono text-emerald-400 border border-zinc-800">
                  {buildCommand}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'node20' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Compatibilidade Total com Node 20 LTS & React 19 / Vite</span>
                </div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Node 20.x:</strong> Suporte nativo a ES Modules, Fetch API de alta performance e builds ultrarrápidos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Caminho Relativo (<code className="text-amber-300">base: './'</code>):</strong> Configurado no <code className="text-amber-300">vite.config.ts</code> para que assets (CSS, JS, 3D Canvas, Web Audio) carreguem perfeitamente sob qualquer subdiretório do GitHub Pages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Notificações Push no GitHub Pages:</strong> A Web Notification API funciona 100% no GitHub Pages porque ele roda nativamente sobre protocolo seguro <strong>HTTPS</strong>!</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="relative z-10 px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Hospedagem 100% Gratuita & HTTPS</span>
          </div>

          <button
            id="btn-close-deploy-guide-footer"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all shadow-md shadow-amber-500/20"
          >
            Entendido, Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
