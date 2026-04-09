FROM php:8.2-apache

# 1. Instala dependências do sistema e extensões PHP necessárias para Laravel e MySQL
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 2. Habilita o mod_rewrite do Apache (essencial para as rotas do Laravel funcionarem)
RUN a2enmod rewrite

# 3. Instala o Composer vindo da imagem oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Define o diretório de trabalho dentro do container
WORKDIR /var/www/html

# 5. Copia todos os arquivos do seu projeto para dentro do container
COPY . .

# 6. Configura o Apache para apontar para a pasta /public do Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 7. Instala as dependências do Laravel via Composer
RUN composer install --no-dev --optimize-autoloader

# 8. Dá as permissões de escrita para as pastas de cache e log
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 9. Abre a porta 80 para o Render
EXPOSE 80

# 10. Inicia o Apache em primeiro plano
CMD ["apache2-foreground"]
