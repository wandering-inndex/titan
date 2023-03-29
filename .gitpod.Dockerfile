FROM gitpod/workspace-full

# setup required node version
USER gitpod
COPY .nvmrc $HOME
RUN bash -c "source $HOME/.nvm/nvm.sh && nvm install && nvm use"

# setup required pnpm version
RUN npm install -g pnpm
RUN pnpm install
