FROM php:8.2-apache

# 1. Instala dependências do sistema e Node.js (necessário para o Front)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    gnupg

# Instala Node.js (versão 18 ou superior)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# 2. Habilita o mod_rewrite do Apache
RUN a2enmod rewrite

# 3. Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# 4. Configura o Apache para a pasta /public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Instala dependências do PHP
RUN composer install --no-dev --optimize-autoloader

# 6. COMPILA O FRONT-END (O que estava faltando)
# Isso gera os arquivos dentro de public/build
RUN npm install
RUN npm run build

# 7. Permissões
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["apache2-foreground"]
